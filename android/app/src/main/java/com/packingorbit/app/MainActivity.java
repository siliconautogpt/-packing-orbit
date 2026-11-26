package com.packingorbit.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getBridge().getWebView().addJavascriptInterface(new WhatsAppBridge(), "PackingOrbitNative");
    }

    public class WhatsAppBridge {
        /**
         * Save the base64 badge PNG and open WhatsApp with the exact customer chat (jid)
         * and the image attached — no contact search, no wrong-recipient risk.
         */
        @JavascriptInterface
        public boolean shareImageToWhatsApp(String base64, String phone, String text) {
            try {
                String clean = base64 != null && base64.contains(",")
                        ? base64.substring(base64.indexOf(",") + 1)
                        : base64;
                byte[] bytes = Base64.decode(clean, Base64.DEFAULT);

                File dir = new File(getCacheDir(), "inward-badges");
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                File file = new File(dir, "inward-" + System.currentTimeMillis() + ".png");
                FileOutputStream out = new FileOutputStream(file);
                out.write(bytes);
                out.flush();
                out.close();

                Uri uri = FileProvider.getUriForFile(
                        MainActivity.this,
                        getPackageName() + ".fileprovider",
                        file
                );

                String digits = phone == null ? "" : phone.replaceAll("[^0-9]", "");
                if (digits.length() == 10) {
                    digits = "91" + digits;
                }
                final String jid = digits + "@s.whatsapp.net";

                final Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("image/png");
                intent.putExtra(Intent.EXTRA_STREAM, uri);
                intent.putExtra(Intent.EXTRA_TEXT, text == null ? "" : text);
                intent.putExtra("jid", jid);
                intent.setPackage("com.whatsapp");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            startActivity(intent);
                        } catch (Exception e) {
                            // WhatsApp not installed — ignore
                        }
                    }
                });
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }
}
