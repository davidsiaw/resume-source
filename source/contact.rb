require_relative "util.rb"

def make_contact_page(lang)
	topnav_page "#{lang}/contact", "CONTACT: David Siaw" do

		make_menu(lang)
		
		row do
			col 12 do
				ibox do

					renderer = Redcarpet::Render::HTML.new()
					markdown = Redcarpet::Markdown.new(renderer, autolink: true, tables: true)
					content = File.read("data/#{lang}/contact.md").split("---", 2)[1]

					rendered = markdown.render(content)

					rendered.gsub!(/<img src="(.+?)"/, '<img class="img-responsive" src="/images/\\1"')

					text "#{rendered}"

				end
			end

		end

	end

end
