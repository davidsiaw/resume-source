name: luacppinterface
---

ボンバーマンクローンの[https://github.com/ten-forward/bomberman](https://github.com/ten-forward/bomberman)のために作ったLuaとC++のバインダー

Luaの複雑なC APIをC++に手軽に使えるため、簡単にわかりやすいバインダーを作りました。

利用例:

    // Cにすでに存在している公式をLuaにリンクする
    auto absolute = lua.CreateFunction<int(int)>(abs);
    
    // 新しいC++ lambdaをLuaにリンクする
    auto lambdaFunc = lua.CreateFunction<void()>([&]()
    {
        std::cout << "called lambdaFunc" << std::endl;
    });

メンテ―ナンスをしやすくために、Luaの紛らわしい使い方はこのバインダーには使いずらいようにしました（例えば文字列や数字以外のテーブルキーはこのバインダーに禁じられています）。