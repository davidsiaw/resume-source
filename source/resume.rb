require_relative "util.rb"
require "redcarpet"
require "yaml"

def make_resume_printable(lang)
	work_exp = YAML::load(File.open("data/#{lang}/work_exp.yml"))
	education = YAML::load(File.open("data/#{lang}/education.yml"))
	projects = YAML::load(File.open("data/#{lang}/personal_projects.yml"))
	strings = YAML::load(File.open("data/#{lang}/strings.yml"))

	raw_page "#{lang}/printable", "RESUME: David Siaw" do
		html do
			head do
				meta charset:"utf-8"
				title "#{strings["resume"]}: David Siaw"
				style <<-STYLE
@page { margin: 0; }
@media print {
  @page
  {
  	margin: 1.4cm;
  }

  .page-break 
  { 
  	height:0; 
  	page-break-before:always; 
  	margin:1.6cm; 
  	border-top:none; 
  }

  header, footer { display: none !important; color: white; }
}

body {
	font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

h1
{
	margin-top: 0.2em;
	margin-bottom: 0.2em;
	font-size: 2.0em;
}

h2
{
	margin-top: 0.2em;
	margin-bottom: 0.2em;
	font-size: 1.7em;
	border-top: 1px solid black;
}

.table
{
	width: 100%;
	margin-top: 3mm;
	border-spacing: 0px;
	border-top: 1px solid black;
	border-left: 1px solid black;
	page-break-inside:avoid;
}

.table td
{
  	font-size:0.8em;
	border-right: 1px solid black;
	border-bottom: 1px solid black;
	padding-left: 10px;
	padding-right: 10px;
}

.title_cell
{
	text-align: right;
	font-weight: bold;
}

				STYLE

text '<!-- start Mixpanel --><script type="text/javascript">(function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
mixpanel.init("'+(ENV['MIXPANEL_TOKEN'])+'"); mixpanel.track("printable", {lang:"'+lang.to_s+'"}); </script><!-- end Mixpanel -->'

			end
			body do
				h1 strings["resume"], style: "text-align: center"
				h4 strings["as_of_date"].
					sub("<<year>>", Time.now.year.to_s).
					sub("<<month>>", Time.now.month.to_s).
					sub("<<day>>", Time.now.day.to_s),
					style: "text-align: right; margin: 2px"
				h4 "#{strings["subject_name"]}: #{strings["david_siaw"]}", style: "text-align: right; margin: 2px"

				h2 "■ " + strings["work_experience"]

				div id:"work_exp" do
					fancy_table(
						lang: lang,
						data: work_exp.reverse, 
						show_columns: [:company, :start_date, :languages], 
						tag_columns:{
							languages: :danger,
							frameworks: :info,
							oses: :warning,
							services: :success
						}
					) do |columns, items|
						table do
							tr do
								td strings["company"], style: "width: 12%;", class: "title_cell"
								td items[:company]
								td strings["position"], style: "width: 20%", class: "title_cell"
								td items[:position], style: "width: 30%"
							end
							tr do
								td strings["time_in_office"], class: "title_cell"
								td "#{items[:start_date]} ~ #{items[:end_date]}"
								td strings["location"], class: "title_cell"
								td items[:location]
							end
							tr do
								td strings["languages"], class: "title_cell"
								td do
									items[:languages].each do |x|
										span x, style:"font-size: 11px; margin:2px; padding:1px; padding-right: 2px; padding-left: 2px; border-radius: 10px; "
									end if items[:languages]
								end
								td strings["frameworks"], class: "title_cell"
								td do
									items[:frameworks].each do |x|
										span x, style:"font-size: 11px; margin:2px; padding:1px; padding-right: 2px; padding-left: 2px; border-radius: 10px"
									end if items[:frameworks]
								end
							end
							tr do
								td strings["oses"], class: "title_cell"
								td do
									items[:oses].each do |x|
										span x, style:"font-size: 11px; margin:2px; padding:1px; padding-right: 2px; padding-left: 2px; border-radius: 10px"
									end if items[:oses]
								end
								td strings["services"], class: "title_cell"
								td do
									items[:services].each do |x|
										span x, style:"font-size: 11px; margin:2px; padding:1px; padding-right: 2px; padding-left: 2px; border-radius: 10px"
									end if items[:services]
								end
							end
							tr do
								td colspan: 4, style: "padding: 0.2cm; font-size: 12px" do
									#ul items[:roles].map{|x| "<li>#{x}</li>"}.join("")
									text items[:detail]
								end
							end
						end
					end
				end

				h2 "■ " + strings["about_me"]

				table do
					tr do
						td style: "padding: 3mm" do
							renderer = Redcarpet::Render::HTML.new()
							markdown = Redcarpet::Markdown.new(renderer, autolink: true, tables: true)
							content = File.read("data/#{lang}/about.md").split("---", 2)[1]

							rendered = markdown.render(content)

							rendered.gsub!(/<img src="(.+?)"/, '<img class="img-responsive" src="/images/\\1"')

							text "#{rendered}"

						end
					end
				end
			end
		end
	end
end

def make_resume_proper(lang)
	work_exp = YAML::load(File.open("data/#{lang}/work_exp.yml"))
	education = YAML::load(File.open("data/#{lang}/education.yml"))
	projects = YAML::load(File.open("data/#{lang}/personal_projects.yml"))
	strings = YAML::load(File.open("data/#{lang}/strings.yml"))


	topnav_page "#{lang}", "RESUME: David Siaw" do

		make_menu(lang)

		row do
			col 12 do
				ibox collapsible: true do
					title strings["work_experience"]

					fancy_table(
						lang: lang,
						data: work_exp.reverse, 
						show_columns: [:company, :start_date, :languages], 
						tag_columns:{
							languages: :danger,
							frameworks: :info,
							oses: :warning,
							services: :success
						}
					)
				end
			end
		end

		row do
			col 12 do
				ibox collapsible: true do
					title strings["side_projects"]

					p strings["side_projects_comment"]

					fancy_table(
						lang: lang,
						data: projects, 
						show_columns: [:name, :description, :languages],
						link_columns: [:url], 
						tag_columns:{
							languages: :danger
						}
					)
				end
			end
		end

		row do
			col 12 do
				ibox collapsible: true do
					title strings["tertiary_education"]

					fancy_table(
						lang: lang,
						data: education, 
						show_columns: [:education, :end_year]
					)
				end

				on_page_load <<-SCRIPT
			        WinMove();
				SCRIPT
			end

		end

		on_page_load <<-SCRIPT
			mixpanel.track("normal", {lang:"#{lang.to_s}"});
		SCRIPT

	end
end
