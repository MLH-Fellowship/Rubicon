
const convert_html_to_readme = function (html_code) {
	var TurndownService = require('turndown');
	var fs = require('fs');

	var turndownService = new TurndownService();
	var markdown = turndownService.turndown(html_code);

	fs.writeFile('example.md', markdown, function (err) {
  		if (err) return console.log(err);
  		console.log('the content s saved to file example.md');
	});

}

module.exports ={
        convert_html_to_readme
    };