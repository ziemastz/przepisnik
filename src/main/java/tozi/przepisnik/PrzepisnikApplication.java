package tozi.przepisnik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class PrzepisnikApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrzepisnikApplication.class, args);
	}

}
