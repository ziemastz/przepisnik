package jwd.przepisnik.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ReactController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/{path:^(?!api|static|h2-console)(?!.*\\.).*$}/**")
    public String forwardSpaRoutes(@PathVariable String path) {
        return "forward:/index.html";
    }
}
