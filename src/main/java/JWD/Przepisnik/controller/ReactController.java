package JWD.Przepisnik.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping({"/{path:^(?!api$|static$)[^\\.]*}", "/{path:^(?!api$|static$)[^\\.]*}/**"})
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
