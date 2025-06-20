package com.example.MediLine.Scheduler;

import com.example.MediLine.Service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TokenCleanupScheduler {

    @Autowired
    private RefreshTokenService refreshTokenService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanExpiredTokens() {
        refreshTokenService.deleteExpiredTokens();
    }
}