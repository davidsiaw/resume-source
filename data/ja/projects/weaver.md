name: weaver
---

**※本ウェブサイトはこのツールを使って作りました。**

Weaverは静的ウェブサイトを作るツールです。ウェブサイトの書き方はWeaver専用のRuby DSLでする。

シンプルなウェブページ例:

    center_page "Hello world" do
        ibox do
            h2 "Hello world!"
            for i in 1..5
                p "#{i}"
            end
        end
    end

上記の例に書かれたように、HTMLと違ってRuby DSLでウェブサイトを書くとRubyのいろんな機能を利用していろいろを自動化することが可能になります。

HTMLを利用する時と同じ「リフレッシュして更新を直接見える」を得るため、便利なプレビューサーバも提供しています。

詳しくはウェブサイトでご覧ください: [http://davidsiaw.github.io/weaver-docs/](http://davidsiaw.github.io/weaver-docs/)
