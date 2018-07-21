name: weaver
---

Weaver is a static website generation tool with a Ruby-based DSL that allows the very rapid development of static websites.

Weaver is used to generate my resume website.

A simple web page in weaver looks like this:

    center_page "Hello world" do
        ibox do
            h2 "Hello world!"
            for i in 1..5
                p "#{i}"
            end
        end
    end

This illustrates that you can use Ruby in your website code unlike in HTML. It also comes with a preview server that allows you to refresh your page after changing it, just like you would do with a website served from the filesystem.

Additional documentation is here: [http://davidsiaw.github.io/weaver-docs/](http://davidsiaw.github.io/weaver-docs/)
