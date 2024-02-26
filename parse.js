const yaml_parser = require('js-yaml');
const fs = require('fs');

base_html = fs.readFileSync('base.html', 'utf8');

languages = ['en', 'pt-br'];

for (var i = 0; i < languages.length; i++) {
	var lang = languages[i];
	var lang_file = fs.readFileSync('lang/' + lang + '.yml', 'utf8');
	var lang_json = yaml_parser.load(lang_file);

	var html = base_html;

	var experiences = lang_json['company_list'];
	var experience_list_html = '';
	for (var j = 0; j < experiences.length; j++) {
		var experience = experiences[j];
		var experience_html = experience_boilerplate();
		var experience_keys = Object.keys(experience);
		for (var k = 0; k < experience_keys.length; k++) {
			var key = experience_keys[k]; 
			var value = experience[key];

			if (key == 'bullets') {
				var bullets = '';
				for (var l = 0; l < value.length; l++) {
					bullets += '<li>' + value[l] + '</li>\n';
				}
				value = bullets;
			}
			experience_html = experience_html.replace('{{' + key + '}}', value);
		}
		experience_list_html += experience_html;
	}
		html = html.replace('{{company_list}}', experience_list_html);

	var educations = lang_json['education_list'];
	var education_list_html = '';
	for (var j = 0; j < educations.length; j++) {
		var education = educations[j];
		var education_html = education_boilerplate();
		var education_keys = Object.keys(education);
		for (var k = 0; k < education_keys.length; k++) {
			var key = education_keys[k];
			var value = education[key];
			education_html = education_html.replaceAll('{{' + key + '}}', value);
		}
		education_list_html += education_html;
	}
	html = html.replace('{{education_list}}', education_list_html);

	var projects = lang_json['project_list'];
	var project_list_html = '';
	for (var j = 0; j < projects.length; j++) {
		var project = projects[j];
		var project_html = project_boilerplate();
		var project_keys = Object.keys(project);
		for (var k = 0; k < project_keys.length; k++) {
			var key = project_keys[k];
			var value = project[key];
			project_html = project_html.replaceAll('{{' + key + '}}', value);
		}
		project_list_html += project_html;
	}
	html = html.replace('{{project_list}}', project_list_html);

	var keys = Object.keys(lang_json);
	for (var j = 0; j < keys.length; j++) {
		var key = keys[j];
		var value = lang_json[key];
		html = html.replaceAll('{{' + key + '}}', value);
	}

	still_missing = html.match(/{{.*}}/g);
	if (still_missing) {
		console.log('Missing keys for ' + lang + ': ' + still_missing);
	}

	fs.writeFileSync('dist/' + lang + '.html', html);
}



function experience_boilerplate() {
	var html = `
					<div>
						<span class="company-name">{{company-name}}</span>
						<span>{{work-type}}</span>
						<span> - </span>
						<span class="company-role">{{role}}</span>
						 <a href="{{link}}">{{link_clean}}</a>
					</div>
					<span class='company-period'>
{{work-period}}
					</span>
					<p class='company-description'>
{{description}}
						<ul>
{{bullets}}
						</ul>
					</p>
					<div style="display: flex; flex-direction: column; margin-top: 0.5cm;">
						<span style="font-weight: bold; color: teal;">{{used_tech}}</span>
						<span style="color: gray;" class='company-technologies'> {{used_tech_list}}</span>
					</div>
`
	return html
}

function project_boilerplate() {
	var html = `
					<div class="project">
						<span class="project-name">{{project-name}}</span>
						<span class="project-skills">{{project-skills}}</span>
</br>
						<a class="project-link" href="{{project-link}}">{{project-link}}</a>
						<p class="project-description">{{project-description}}</p>
					</div>
`

	return html
}

function education_boilerplate() {
	var html = `
				<div display="flex" flex-direction="column">
					<span style="font-weight: 600;"> {{name}} </span>
					<p style="margin: 0.1cm 0;">
						{{description}}
						<a href=""></a>
					</p>
				</div>
`
	return html
}
