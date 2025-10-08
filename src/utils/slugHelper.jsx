// utils/slugHelper.js

/**
 * Converts a product name to a URL-friendly slug
 * Example: "Green Tea Extract 100mg" -> "green-tea-extract-100mg"
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars except -
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Creates a unique slug by appending product ID
 * Example: "green-tea-extract-100mg-abc123"
 */
export const createUniqueSlug = (name, id) => {
  const slug = createSlug(name);
  const shortId = id.slice(-6); // Use last 6 chars of ID for uniqueness
  return `${slug}-${shortId}`;
};

/**
 * Extracts product ID from slug
 * Example: "green-tea-extract-100mg-abc123" -> "abc123"
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  const parts = slug.split('-');
  return parts[parts.length - 1]; // Return last part (the ID)
};

/**
 * Validates if a slug matches a product
 */
export const validateSlug = (slug, product) => {
  if (!slug || !product) return false;
  const expectedSlug = createUniqueSlug(product.name, product._id);
  return slug === expectedSlug;
};