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

	end
end
