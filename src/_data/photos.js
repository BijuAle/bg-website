const cloudinary = require("cloudinary").v2;

module.exports = async function () {
  const { resources } = await cloudinary.search
    .expression('resource_type:image')
    .with_field('tags')
    .with_field('context')
    .with_field('metadata')
    .with_field('image_metadata')
    .with_field('image_analysis')
    .sort_by('created_at', 'desc')
    .max_results(500)
    .execute();

  const tags = {};
  const photos = resources.map(photo => {
    photo.tags.forEach(tag => {
      if (!tags[tag]) tags[tag] = [];
      tags[tag].push(photo);
    });
    return photo;
  });

  const thumbnails = {};

  // Find thumbnail for each tag, then sort each tag chronologically (oldest first)
  Object.keys(tags).forEach(tag => {
    let bestThumb = tags[tag][0]; // fallback to most-recently-uploaded if none is marked
    let maxScore = -1;
    
    tags[tag].forEach(photo => {
      const val = photo.context?.thumbnail;
      const score = val === tag ? 2 : val === "true" ? 1 : 0;
      if (score > maxScore && score > 0) {
        maxScore = score;
        bestThumb = photo;
      }
    });
    
    thumbnails[tag] = bestThumb;

    // Sort chronologically (oldest first)
    tags[tag].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  });

  const fs = require('fs');
  const path = require('path');
  
  const orderFilePath = path.join(__dirname, 'tags_order.json');
  let manualTagOrder = [];
  
  // 1. Read existing order from file (if it exists)
  if (fs.existsSync(orderFilePath)) {
    try {
      manualTagOrder = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
    } catch (e) {
      console.error("Error reading tags_order.json", e);
    }
  }

  // 2. Find any new tags that aren't in the file yet
  const allCurrentTags = Object.keys(tags);
  const newTags = allCurrentTags.filter(tag => !manualTagOrder.includes(tag));
  
  // 3. If there are new tags, add them to the file automatically
  if (newTags.length > 0) {
    manualTagOrder = [...manualTagOrder, ...newTags];
    fs.writeFileSync(orderFilePath, JSON.stringify(manualTagOrder, null, 2));
  }

  // 4. Sort based on the JSON file order
  const sortedTags = allCurrentTags.sort((a, b) => {
    const indexA = manualTagOrder.indexOf(a);
    const indexB = manualTagOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB; 
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return {
    all: photos,
    byTag: tags,
    tags: sortedTags,
    thumbnails: thumbnails
  };
};
