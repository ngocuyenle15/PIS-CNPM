package com.app.pis;

import com.app.pis.service.MailService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class PisApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(PisApplication.class, args);
    }

}
