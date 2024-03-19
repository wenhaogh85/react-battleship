// generates a random number inclusive of minimum and maxmimum range provided
export function getRandomNumber(minimum: number, maximum: number): number {
  minimum = Math.ceil(minimum);
  maximum = Math.floor(maximum);
  const randomNumber = Math.floor(
    Math.random() * (maximum - minimum + 1) + minimum
  );
  return randomNumber;
}

export function capitalize(text: string): string {
  const firstLetter = text.charAt(0).toUpperCase();
  const remainingLetters = text.slice(1).toLowerCase();
  const newText = firstLetter + remainingLetters;
  return newText;
}
