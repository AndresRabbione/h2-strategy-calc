export function getParsedDBObjectiveText(
  objectiveText: string
): { text: string; color: string | null }[] {
  const regex = /<i col="(#[0-9a-fA-F]{6})">(.*?)<\/i>/g;
  const segmentedText: { text: string; color: string | null }[] = [];

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(objectiveText)) !== null) {
    const [fullMatch, color, innerText] = match;

    segmentedText.push({
      text: objectiveText.slice(lastIndex, match.index).trim(),
      color: null,
    });
    segmentedText.push({ text: innerText.trim(), color });
    lastIndex = fullMatch.length + match.index;
  }

  return segmentedText;
}
