package jwd.przepisnik.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import jwd.przepisnik.constants.ApiPaths;

@Controller
public class ReactController {

    @GetMapping(ApiPaths.React.ROOT)
    public String index() {
        return ApiPaths.React.FORWARD_INDEX;
    }

    @GetMapping(ApiPaths.React.SPA_FALLBACK)
    public String forwardSpaRoutes(@PathVariable String path) {
        return ApiPaths.React.FORWARD_INDEX;
    }
}
