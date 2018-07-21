require "redcarpet"
require "yaml"

def fancy_table(lang:, data:, show_columns:, tag_columns:{}, link_columns:[])

	strings = YAML::load(File.open("data/#{lang}/strings.yml"))

	table system: :foo_table do

		columns = {}

		data.each do |item|
			item.each do |k,v|
				columns[k] = {hide: true, index: columns.count} if !columns[k]
			end
		end

		show_columns.each { |col| columns[col][:hide] = false }

		column_array = columns.to_a.sort_by{|x| x[1][:index]}

		if block_given?

			data.each do |item|
				yield(column_array, item) 
			end

		else
			thead do

				column_array.each do |k,v|
					col_name = strings[k.to_s] || ":#{k.to_s}"
					if v[:hide]
						th :"data-hide" => :all do
							text "#{col_name}"
						end
					else
						th { text "#{col_name}" }
					end
				end

			end

			data.each do |item|
				tr do
					for i in 0..column_array.count - 1
						k = column_array[i][0]
						v = item[k]

						if tag_columns.has_key?(k)
							td do
								if item[k]
									item[k].each do |tag|
										badge tag, rounded: true, type: tag_columns[k]
										text " "
									end
								end
							end
						elsif link_columns.include?(k)
							td do
								hyperlink "#{v}"
							end
						else
							td do
								if v.is_a?(Array)
									ul do
										v.each do |element|
											li element
										end
									end
								elsif v.is_a?(Hash)

									meta = YAML.load_file("data/#{lang}/#{v[:file]}")
									renderer = Redcarpet::Render::HTML.new()
									markdown = Redcarpet::Markdown.new(renderer, autolink: true, tables: true)
									content = File.read("data/#{lang}/#{v[:file]}").split("---", 2)[1]

									if meta["toppic"]
										div align:"center" do
											image meta["toppic"]
										end
										hr
									end

									rendered = markdown.render(content)

									rendered.gsub!(/<img src="(.+?)"/, '<img class="img-responsive" src="/images/\\1"')

									text rendered
								else
									text "#{v} "
								end
							end
						end
					end

				end
			end
		end



	end
end

def menu_pages
	pages = {
		resume:  {symbol: :home, path: "/", method: "make_resume_proper"},
		contact: {symbol: :phone, path: "/contact", method: "make_contact_page"},
		github:  {symbol: :github, path: "https://github.com/davidsiaw"}
	}
end

def make_menu(lang)

	strings = YAML::load(File.open("data/#{lang}/strings.yml"))

	menu do
		menu_pages.each do |k,v|
			nav strings["#{k}"], v[:symbol], v[:path].start_with?("https") ? v[:path] : "/#{lang}#{v[:path]}"
		end
	end

	request_css "css/main.css"

	row do
		col 12 do
			jumbotron background: "bg2.jpg" do
				h1 strings["david_siaw"]
				h3 strings["software_engineer"]
				breadcrumb ["DevOps", "Native", "FullStack"]
				h4 strings["tokyo"]
			end
		end
	end
end

def make_pages_for(lang)

	menu_pages.each do |k,v|
		if v[:method]
			send(v[:method], lang)
		end
	end

end

def lang_name(lang)
	names = {
		en: "English",
		ja: "日本語"
	}
	names[lang]
end

def lang_select_button(lang)
	a href:"/#{lang}" do
		image "#{lang}flag.svg"
		h3 "#{lang_name(lang)}"
	end
end
