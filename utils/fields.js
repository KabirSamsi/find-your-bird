module.exports = { //Stores all values for attributes for bird form data
    attrs: ['name', 'description', 'scientificName', 'appearance', 'diet', 'habitat', 'size', 'range', 'colors'],
    colors: ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'],
    sizes: ['Hummingbird Size (2-4 inches)', 'Songbird Size (5-9 inches)', 'Large Songbird Size (10-13 inches)', 'Crow Size (1-1.5 feet)', 'Raptor Size (1.5-2.5 feet)', 'Small Waterfowl Size (2.5-4 feet)', 'Large Waterfowl Size (4-5.5 feet)'],
    habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'],
    values: new Map([ //Ranking of importance for each attribute (when running keyword search)
        ['name', 5],
        ['scientificName', 5],
        ['size', 4],
        ['appearance', 3],
        ['description', 3],
        ['colors', 2],
        ['habitat', 2],
        ['range', 2],
        ['diet', 1]
    ]),
    identifyValues: new Map([ //Ranking of importance for each attribute in identification (when running keyword search)
        ['name', 1.06],
        ['appearance', 1.05],
        ['description', 1.04],
        ['diet', 1.03],
        ['range', 1.02],
        ['scientificName', 1.01]
    ])
};
