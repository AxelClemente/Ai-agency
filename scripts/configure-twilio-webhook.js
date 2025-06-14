const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

// CORREGIDO: Usar el endpoint nativo de ElevenLabs
const webhookUrl = 'https://api.elevenlabs.io/v1/convai/twilio/inbound-call';

if (!accountSid || !authToken || !phoneNumber) {
  console.error('❌ Missing Twilio configuration. Please check your .env file:');
  console.error('   TWILIO_ACCOUNT_SID');
  console.error('   TWILIO_AUTH_TOKEN');
  console.error('   TWILIO_PHONE_NUMBER');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function configureWebhook() {
  try {
    console.log('🔧 Configuring Twilio webhook for ElevenLabs native integration...');
    console.log('📞 Phone Number:', phoneNumber);
    console.log('🌐 ElevenLabs Webhook URL:', webhookUrl);
    
    // Get the phone number SID
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
      phoneNumber: phoneNumber
    });

    if (incomingPhoneNumbers.length === 0) {
      console.error('❌ Phone number not found in your Twilio account:', phoneNumber);
      return;
    }

    const phoneNumberSid = incomingPhoneNumbers[0].sid;
    console.log('✅ Found phone number SID:', phoneNumberSid);

    // Update the phone number configuration to point to ElevenLabs
    const updatedNumber = await client.incomingPhoneNumbers(phoneNumberSid)
      .update({
        voiceUrl: webhookUrl,
        voiceMethod: 'POST',
        // Remove status callback since ElevenLabs handles this
      });

    console.log('✅ Twilio webhook configured for ElevenLabs native integration!');
    console.log('📋 Configuration:');
    console.log('   Phone Number:', updatedNumber.phoneNumber);
    console.log('   Voice URL:', updatedNumber.voiceUrl);
    console.log('   Voice Method:', updatedNumber.voiceMethod);
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. 📱 Go to ElevenLabs Dashboard → Conversational AI → Phone Numbers');
    console.log('2. 🔧 Select your number and configure:');
    console.log('   - Assigned Agent: Hospitality Agent');
    console.log('   - Conversation Initiation Client Data Webhook: https://little-rockets-hug.loca.lt/api/elevenlabs/client-data');
    console.log('3. 📞 Test call: Now ElevenLabs will handle the call directly!');
    
  } catch (error) {
    console.error('❌ Error configuring webhook:', error.message);
    
    if (error.code === 20003) {
      console.error('💡 Tip: Check your TWILIO_AUTH_TOKEN');
    } else if (error.code === 20404) {
      console.error('💡 Tip: Check your phone number format and account');
    }
  }
}

configureWebhook(); 