const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const pool = require('../config/db');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = 'anritvox-products'; // Your Pinecone index name

/**
 * Generates an embedding vector for a given text string
 */
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Synchronizes a product to the Vector Database
 * Call this whenever a product is created or updated in productRoutes.js
 */
async function syncProductToVectorDB(product) {
  try {
    const index = pinecone.index(indexName);
    
    // Create a rich text representation of the product for the AI to "read"
    const contentToEmbed = `
      Product: ${product.name}
      Category: ${product.category_id}
      Brand: ${product.brand || 'Anritvox'}
      Description: ${product.description}
      Tags: ${product.tags || ''}
      Specifications: ${product.specifications || ''}
    `.trim();

    const embedding = await generateEmbedding(contentToEmbed);

    // Upsert the vector into Pinecone, tagging it with the SQL product ID
    await index.upsert([{
      id: product.id.toString(),
      values: embedding,
      metadata: {
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        status: product.status
      }
    }]);

    console.log(`[AI Search] Synced product ID ${product.id} to Vector DB`);
  } catch (error) {
    console.error("[AI Search] Failed to sync product:", error);
  }
}

/**
 * Performs a Semantic AI Search based on user intent
 */
async function performSemanticSearch(userQuery, limit = 10) {
  try {
    const index = pinecone.index(indexName);
    
    // Turn the user's natural language query into a vector
    const queryEmbedding = await generateEmbedding(userQuery);

    // Ask Pinecone for the closest mathematical matches
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
      filter: { status: { $eq: 'active' } } // Only show active products
    });

    if (searchResults.matches.length === 0) return [];

    // Extract the SQL database IDs from the AI matches
    const productIds = searchResults.matches.map(match => match.id);

    // Fetch the full product details from your existing MySQL database
    const [rows] = await pool.query(
      `SELECT p.*, 
      (SELECT JSON_ARRAYAGG(file_path) FROM product_images WHERE product_id = p.id) as images
      FROM products p WHERE p.id IN (?)`,
      [productIds]
    );

    // Sort the SQL results to match the AI's relevance ranking
    const sortedRows = productIds.map(id => rows.find(r => r.id.toString() === id)).filter(Boolean);
    
    return sortedRows;
  } catch (error) {
    console.error("[AI Search] Semantic search failed:", error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  syncProductToVectorDB,
  performSemanticSearch
};
