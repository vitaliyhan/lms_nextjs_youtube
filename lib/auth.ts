import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                // implement sending email to the user
                await resend.emails.send({
                    from: 'LMS <onboarding@resend.dev>',
                    to: [email],
                    subject: 'OTP password',
                    html: `<p>Your OPT <strong>${otp}</strong></p>`
                });
            },
        })
    ]
});