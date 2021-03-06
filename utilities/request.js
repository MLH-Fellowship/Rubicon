//http://127.0.0.1:5000/greet?name=Peter


function convert_html_to_readme(html_code) {
	var TurndownService = require('turndown');
	var fs = require('fs');

	var turndownService = new TurndownService();
	var markdown = turndownService.turndown(html_code);

	fs.writeFile('example.md', markdown, function (err) {
  		if (err) return console.log(err);
  		console.log('the content s saved to file example.md');
	});

}
// var propertiesObject = {
// 	module_name : 'Building the App’s Container Image',
// 	paragraph   : "In order to build the application, we need to use a Dockerfile. A Dockerfile is simply a text-based script of instructions that is used to create a container image. If you’ve created Dockerfiles ,before, you might see a few flaws in the Dockerfile below. But, don’t worry! We’ll go over them. ",
// 	code :"RUN yarn install --production"
//
// };

function request_jinja_template(propertiesObject) {
	var request = require('request');
	var fs = require('fs');
	var url = 'http://127.0.0.1:5000/greet';
	var html_page;

	request({url:url, qs:propertiesObject}, function(err, response, body) {
  		if(err) { console.log(err); return; }

  		html_page = response.body;


		fs.writeFile('example.html', html_page, function (err) {
  			if (err) return console.log(err);
  			console.log('the content s saved to file example.html');
		});

		convert_html_to_readme(html_page)

	});
}





