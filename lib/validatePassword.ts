/**
 * Returns:
 * - `requiredErrors`: rules that must be met (only "8 characters")
 * - `optionalChecks`: other quality suggestions (shown visually)
 */
export function validatePassword(password: string) {
  const requiredErrors: string[] = [];
  const optionalChecks: { rule: string; passed: boolean }[] = [];

  // REQUIRED
  if (password.length < 8) {
    requiredErrors.push('At least 8 characters');
  }

  // OPTIONAL suggestions
  optionalChecks.push({ rule: 'One uppercase letter', passed: /[A-Z]/.test(password) });
  optionalChecks.push({ rule: 'One lowercase letter', passed: /[a-z]/.test(password) });
  optionalChecks.push({ rule: 'One number', passed: /[0-9]/.test(password) });
  optionalChecks.push({
    rule: 'One special character',
    passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  return { requiredErrors, optionalChecks };
}

export function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  return strength;
}
