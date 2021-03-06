//Libraries
let fillers = require('fillers');
let otherFillers = ['aboard', 'and', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'anti', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'bird', 'birds', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'excepting', 'excluding', 'following', 'for', 'from', 'find', 'found', 'in', 'inside', 'into', 'like', 'minus', 'near', 'of', 'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without', 'i', 'me', 'we', 'us', 'you', 'she', 'her', 'he', 'him', 'it', 'they', 'them', 'that', 'which', 'who', 'whom', 'whose', 'whichever', 'whoever', 'whomever', 'when', 'whenever', 'however', 'this', 'these', 'that', 'those', 'anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'my', 'your', 'his', 'her', 'its', 'our', 'your', 'their', 'mine', 'yours', 'his', 'hers', 'ours', 'yours', 'theirs', 'both', 'few', 'many', 'several', 'all', 'any', 'most', 'none', 'some', 'myself  ', 'ourselves', 'yourself', 'yourselves', 'himself', 'herself', 'itself', 'themselves', 'a', 'an', 'the', 'were', 'while', 'fine', 'should', 'could', 'would', 'done', 'doing', 'made', 'making', 'also', 'suppose', 'supposed', 'supposing', 'perhaps', 'different', 'excellent', 'various', 'varying'];

for (let word of otherFillers) {fillers.push(word);}

const filter = function(phrase) { //Filters out excess filler keywords from bird query
	const textSplitter = new RegExp(/[\"\s\'\r\n]/, 'g'); //Regex for common text split delimeters
	const delimeter = new RegExp(/[^a-zA-z0-9]/, 'g'); //Regex for common in-word delimeters

	let cleaned = [];
	for (let word of phrase.split(textSplitter)) { //Splits phrase by non-ascii delimeter
		if (!fillers.includes(word.split(delimeter).join(''))) {cleaned.push(word);} //Adds cleaned word
	}
	return cleaned.join(' ');
}

module.exports = filter;
