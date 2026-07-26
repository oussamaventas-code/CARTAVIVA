import Tesseract from 'tesseract.js';

export interface ParsedDish {
  name: string;
  price: number;
}

export interface ParsedCategory {
  name: string;
  dishes: ParsedDish[];
}

const PRICE_REGEX = /€?\s*(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)?\s*$/i;
const LEADER_DOTS_REGEX = /[.\s]{2,}$/;

function isLikelyCategoryHeading(line: string): boolean {
  if (line.length < 2 || line.length > 30) return false;
  const isAllCaps = line === line.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(line);
  const isTitleCase = line
    .split(/\s+/)
    .every((word) => word.length === 0 || word[0] === word[0].toUpperCase());
  return isAllCaps || isTitleCase;
}

const DEFAULT_CATEGORY_NAME = 'Importado';

export function parseMenuText(rawText: string): ParsedCategory[] {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const categories: ParsedCategory[] = [];
  let current: ParsedCategory | null = null;

  const ensureCurrent = (): ParsedCategory => {
    if (!current) {
      current = { name: DEFAULT_CATEGORY_NAME, dishes: [] };
      categories.push(current);
    }
    return current;
  };

  for (const line of lines) {
    const priceMatch = line.match(PRICE_REGEX);

    if (priceMatch) {
      const price = Number(priceMatch[1].replace(',', '.'));
      if (Number.isNaN(price)) continue;

      const name = line
        .slice(0, priceMatch.index)
        .replace(LEADER_DOTS_REGEX, '')
        .trim();

      if (!name) continue;

      ensureCurrent().dishes.push({ name, price });
      continue;
    }

    if (isLikelyCategoryHeading(line)) {
      current = { name: line, dishes: [] };
      categories.push(current);
    }
  }

  return categories.filter((category) => category.dishes.length > 0);
}

export async function runOcr(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const { data } = await Tesseract.recognize(file, 'spa', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
  });
  return data.text;
}
