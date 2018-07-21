name: luacppinterface
---

LuaCppInterface was created to provide a Lua interface for a Bomberman clone [https://github.com/ten-forward/bomberman](https://github.com/ten-forward/bomberman)

It was basically created so Lua could easily be pulled in to C++ with a minimal amount of fuss:

    // Create a function from an existing C function called "abs" (available in cmath)
    auto absolute = lua.CreateFunction<int(int)>(abs);
    
    // Create a function using a C++ lambda
    auto lambdaFunc = lua.CreateFunction<void()>([&]()
    {
        std::cout << "called lambdaFunc" << std::endl;
    });

It was also made to not be able to do everything that Lua can do to improve usability and maintainability.
