require "redcarpet"
require "yaml"

def fancy_table(data:, show_columns:, tag_columns:{}, link_columns:[])

	table system: :foo_table do

		columns = {}

		data.each do |item|
			item.each do |k,v|
				columns[k] = {hide: true, index: columns.count} if !columns[k]
			end
		end

		show_columns.each { |col| columns[col][:hide] = false }

		column_array = columns.to_a.sort_by{|x| x[1][:index]}

		thead do

			column_array.each do |k,v|
				col_name = k.to_s.gsub("_", " ").capitalize
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

								meta = YAML.load_file(v[:file])
								renderer = Redcarpet::Render::HTML.new()
								markdown = Redcarpet::Markdown.new(renderer, autolink: true, tables: true)
								content = File.read(v[:file]).split("---", 2)[1]

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

def make_menu

	menu do
		nav "Resume", :home, "/"
		#nav "Game Resume", :gamepad, "/game"
		nav "About Me", :file, "/personal"
		nav "Contact", :phone, "/contact"
		nav "Github ", :github, "https://github.com/davidsiaw"
	end

	request_css "css/main.css"

	row do
		col 12 do
			jumbotron background: "bg2.jpg" do
				h1 "David Siaw"
				h3 "Software Engineer"
				breadcrumb ["DevOps", "Native", "FullStack"]
				h4 "Tokyo"
			end
		end
	end
end