package jwd.przepisnik.config;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootTest
@AutoConfigureMockMvc
@Import(SecurityConfigIntegrationTest.TestEndpoints.class)
class SecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldAllowApiLoginWithoutCsrfToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"data":{"username":"john","password":"wrong-password"}}
                        """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void shouldRejectNonApiPostWithoutCsrfToken() throws Exception {
        mockMvc.perform(post("/test/csrf-protected"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void shouldAllowNonApiPostWithCsrfToken() throws Exception {
        mockMvc.perform(post("/test/csrf-protected").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));
    }

    @RestController
    static class TestEndpoints {

        @PostMapping("/test/csrf-protected")
        String csrfProtected() {
            return "ok";
        }
    }
}