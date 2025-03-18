import { randomInt } from 'crypto';

/**
 * Generates a random 4-digit code.
 * @returns A 4-digit code as a string.
 */
export function generate4DigitCode(): string {
  return randomInt(1000, 10000).toString(); // Generates a number between 1000 and 9999
}
