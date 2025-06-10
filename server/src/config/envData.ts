import { IEnvData } from "../interfaces/IConfig"

const envData : IEnvData = {
    accessTokenSignature : process.env.ACCESS_TOKEN_SIGNATURE || "accessTokenSignature",
    managementAccessToken : process.env.MANAGEMENT_ACCESS_TOKEN_SIGNATURE || "managementAccessTokenSignaturea",
    otpDefaultExpirySec : process.env.OTP_DEFAULT_EXPIRY_SEC || "300",
    emailHost :  process.env.EMAIL_HOST || "",
    emailPort : "",
    emailSecure : process.env.EMAIL_SECURE === "true" || false,
    emailUser : process.env.EMAIL_USER || "",
    emailPass : process.env.EMAIL_PASS || "",
    client_url : process.env.CLIENT_URL || ""
}

export default envData;
