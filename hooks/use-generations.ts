import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';

export interface Generation {
    id: string;
    user_id: string;
    input_content: string;
    title: string; // Virtual field for display
    platforms: string[];
    status: 'completed' | 'archived' | 'deleted';
    created_at: string;
    tokens_used: number;
    posts: {
        platform: string;
        content: string;
        hashtags: string[];
        mentions: string[];
        metadata?: {
            characterCount: number;
            timestamp: number;
            formattedDate: string;
        };
    }[];
}

export function useGenerations() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient<Database>();

    const fetchGenerations = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('No user found');

            // First, let's log what we're querying
            console.log('Fetching generations for user:', user.id);

            const { data, error: fetchError } = await supabase
                .from('generations')
                .select(`
                    id,
                    user_id,
                    input_content,
                    posts,
                    platforms,
                    tokens_used,
                    created_at,
                    status
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Log the raw data immediately
            console.log('Raw database response:', {
                count: data?.length || 0,
                firstRecord: data?.[0],
                allRecords: data
            });

            // Transform the data to ensure proper structure
            const transformedData = data?.map(gen => {
                // Extract title from input_content
                let title = gen.input_content || 'Untitled Generation';
                if (title.length > 50) {
                    title = title.slice(0, 50) + '...';
                }

                // Create the initial transformed generation with platform-based posts
                const transformedGen: Generation = {
                    ...gen,
                    title,
                    platforms: gen.platforms || [],
                    status: gen.status || 'completed',
                    posts: (gen.platforms || []).map((platform: string) => ({
                        platform,
                        content: '',
                        hashtags: [],
                        mentions: []
                    }))
                };

                // If we have actual posts data, merge it with our platform-based posts
                if (gen.posts && typeof gen.posts === 'object') {
                    try {
                        const postsData = gen.posts as Record<string, any[]>;
                        const allPosts: Generation['posts'] = [];

                        // Iterate through each platform's posts array
                        Object.entries(postsData).forEach(([platform, platformPosts]) => {
                            if (Array.isArray(platformPosts)) {
                                platformPosts.forEach(post => {
                                    allPosts.push({
                                        platform,
                                        content: post.content || '',
                                        hashtags: post.hashtags || [],
                                        mentions: post.mentions || [],
                                        metadata: post.metadata || {
                                            characterCount: post.content?.length || 0,
                                            timestamp: Date.now(),
                                            formattedDate: new Date().toISOString()
                                        }
                                    });
                                });
                            }
                        });

                        transformedGen.posts = allPosts;
                    } catch (e) {
                        console.error('Error merging posts data for generation', gen.id, ':', e);
                    }
                }

                return transformedGen;
            }) || [];

            console.log('Final transformed data:', transformedData.map(g => ({
                id: g.id,
                postsCount: g.posts.length,
                samplePost: g.posts[0]
            })));

            setGenerations(transformedData);
        } catch (err) {
            console.error('Error fetching generations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch generations');
        } finally {
            setLoading(false);
        }
    };

    const deleteGenerations = async (ids: string[]) => {
        try {
            console.log('Attempting to delete generations with IDs:', ids);

            const { data, error } = await supabase
                .from('generations')
                .delete()
                .in('id', ids)
                .select(); // Add select to see what was deleted

            console.log('Delete response:', { data, error });

            if (error) {
                console.error('Supabase delete error:', error);
                throw error;
            }
            
            // Update local state by removing the deleted items
            setGenerations(prev => {
                const newGenerations = prev.filter(gen => !ids.includes(gen.id));
                console.log('Updated generations:', {
                    before: prev.length,
                    after: newGenerations.length,
                    removed: prev.length - newGenerations.length
                });
                return newGenerations;
            });
            
            toast.success(`${ids.length} generation${ids.length === 1 ? '' : 's'} deleted`);
        } catch (err) {
            console.error('Error deleting generations:', err);
            toast.error('Failed to delete generations');
            throw err; // Re-throw to see the full error in console
        }
    };

    const archiveGenerations = async (ids: string[]) => {
        try {
            // First, verify we can read the generations
            const { data: existingData, error: readError } = await supabase
                .from('generations')
                .select('*')
                .in('id', ids);

            console.log('Current generations:', { existingData, readError });

            if (readError) {
                console.error('Error reading generations:', readError);
                toast.error('Failed to read generations');
                return;
            }

            if (!existingData?.length) {
                console.error('No generations found with IDs:', ids);
                toast.error('No generations found to archive');
                return;
            }

            // Now try to update them
            console.log('Attempting to archive generations with IDs:', ids);

            const { data: updatedData, error: updateError } = await supabase
                .from('generations')
                .update({ status: 'archived' })
                .in('id', ids)
                .select();

            console.log('Archive response:', { 
                success: !updateError,
                data: updatedData,
                error: updateError,
                errorMessage: updateError?.message,
                errorDetails: updateError?.details
            });

            if (updateError) {
                console.error('Supabase archive error:', updateError);
                toast.error(`Failed to archive: ${updateError.message}`);
                return;
            }
            
            if (!updatedData?.length) {
                console.error('No generations were updated');
                toast.error('Failed to archive generations');
                return;
            }

            // Update local state only if database update was successful
            setGenerations(prev => {
                const updatedGenerations = prev.map(gen => 
                    ids.includes(gen.id) 
                        ? { ...gen, status: 'archived' as const } 
                        : gen
                );
                console.log('State update:', {
                    previousCount: prev.length,
                    newCount: updatedGenerations.length,
                    archivedCount: updatedGenerations.filter(g => g.status === 'archived').length
                });
                return updatedGenerations;
            });
            
            toast.success(`${ids.length} generation${ids.length === 1 ? '' : 's'} archived`);
        } catch (err) {
            console.error('Unexpected error archiving generations:', err);
            toast.error('An unexpected error occurred');
        }
    };

    const unarchiveGenerations = async (ids: string[]) => {
        try {
            const { data: updatedData, error: updateError } = await supabase
                .from('generations')
                .update({ status: 'completed' })
                .in('id', ids)
                .select();

            if (updateError) {
                console.error('Supabase unarchive error:', updateError);
                toast.error(`Failed to unarchive: ${updateError.message}`);
                return;
            }
            
            if (!updatedData?.length) {
                console.error('No generations were updated');
                toast.error('Failed to unarchive generations');
                return;
            }

            // Update local state
            setGenerations(prev => {
                const updatedGenerations = prev.map(gen => 
                    ids.includes(gen.id) 
                        ? { ...gen, status: 'completed' as const } 
                        : gen
                );
                return updatedGenerations;
            });
            
            toast.success(`${ids.length} generation${ids.length === 1 ? '' : 's'} unarchived`);
        } catch (err) {
            console.error('Unexpected error unarchiving generations:', err);
            toast.error('An unexpected error occurred');
        }
    };

    const regenerateContent = async (id: string) => {
        try {
            const generation = generations.find(g => g.id === id);
            if (!generation) throw new Error('Generation not found');

            // Call the generate API endpoint with the original generation data
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: generation.title,
                    platforms: generation.platforms,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to regenerate content');
            }

            const result = await response.json();
            
            // Update the generation with new content
            const { error: updateError } = await supabase
                .from('generations')
                .update({ 
                    posts: result.data.posts,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // Update local state
            setGenerations(prev => 
                prev.map(gen => 
                    gen.id === id 
                        ? { ...gen, posts: result.data.posts } 
                        : gen
                )
            );
            
            toast.success('Content regenerated successfully');
        } catch (err) {
            console.error('Error regenerating content:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to regenerate content');
        }
    };

    const exportGenerations = async (ids: string[], format: 'CSV' | 'JSON') => {
        try {
            const selectedGenerations = generations.filter(gen => ids.includes(gen.id));
            
            if (format === 'JSON') {
                const jsonStr = JSON.stringify(selectedGenerations, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `generations-${new Date().toISOString()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                // CSV format with detailed post information
                const headers = [
                    'Title',
                    'Platforms',
                    'Status',
                    'Created At',
                    'Posts Count',
                    'Platform',
                    'Content',
                    'Hashtags',
                    'Mentions'
                ];

                const rows: string[][] = [];
                selectedGenerations.forEach(gen => {
                    if (gen.posts.length === 0) {
                        // If no posts, add one row with generation info
                        rows.push([
                            gen.title,
                            gen.platforms.join(', '),
                            gen.status,
                            new Date(gen.created_at).toLocaleString(),
                            '0',
                            '',
                            '',
                            '',
                            ''
                        ]);
                    } else {
                        // Add a row for each post
                        gen.posts.forEach(post => {
                            rows.push([
                                gen.title,
                                gen.platforms.join(', '),
                                gen.status,
                                new Date(gen.created_at).toLocaleString(),
                                gen.posts.length.toString(),
                                post.platform,
                                post.content,
                                post.hashtags.join(' '),
                                post.mentions.join(' ')
                            ]);
                        });
                    }
                });
                
                const csvContent = [
                    headers.join(','),
                    ...rows.map(row => row.map(cell => 
                        // Escape cells that contain commas or newlines
                        cell.includes(',') || cell.includes('\n') 
                            ? `"${cell.replace(/"/g, '""')}"` 
                            : cell
                    ).join(','))
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `generations-${new Date().toISOString()}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            toast.success(`Exported ${ids.length} generation${ids.length === 1 ? '' : 's'} as ${format}`);
        } catch (err) {
            console.error('Error exporting generations:', err);
            toast.error('Failed to export generations');
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, []);

    return {
        generations,
        loading,
        error,
        deleteGenerations,
        archiveGenerations,
        unarchiveGenerations,
        exportGenerations,
        regenerateContent,
        refresh: fetchGenerations
    };
} 