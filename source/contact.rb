require_relative "util.rb"

def make_contact_page(lang)
	topnav_page "#{lang}/contact", "CONTACT: David Siaw" do

		make_menu(lang)
		
		row do
			col 12 do
				ibox do

					p "While it is likely that you have arrived at this page because I directed you to it, if I did not give you a way to contact me, you can reach me here via the instructions below:"

					h3 "Contact me at"

					h2 "davidsiaw at google mail"

					h5 "You can write the full e-mail address now ;)"
				end
			end

		end

	end

end
