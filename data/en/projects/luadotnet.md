name: luadotnet
---

Basically an API for using Lua in C#. Nothing fancy. Just simple.

Simple example in C#:

    Lua l = new Lua();
    l.Register("print", new Action<string>(x=>Console.WriteLine(x)));

Using this its possible to run a Lua script like this:

    print("haha")

And it will call the C# function

