package JWD.Przepisnik.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReactControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldForwardRootRequestToIndexHtml() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    @WithMockUser
    void shouldForwardNestedSpaRoutesToIndexHtml() throws Exception {
        mockMvc.perform(get("/recipes/list"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void shouldNotInterceptApiRequests() throws Exception {
        mockMvc.perform(get("/api/ingredients"))
                .andExpect(status().isUnauthorized());
    }
}
