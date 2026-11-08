package io.github.infanteeric03.simulador;

import android.os.Handler;
import android.os.Looper;
import android.view.KeyEvent;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

/**
 * Mantener pulsado «atrás» 3 segundos cierra la app por completo (con la navegación de 3 botones).
 * Una pulsación normal sigue llegando a la web, que cierra lo que esté abierto o pregunta antes de salir.
 */
public class MainActivity extends BridgeActivity {
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean quitting = false;
    private final Runnable quit = () -> {
        quitting = true;
        Toast.makeText(this, "Cerrando el simulador", Toast.LENGTH_SHORT).show();
        finishAndRemoveTask();
    };

    @Override
    public boolean dispatchKeyEvent(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            if (e.getAction() == KeyEvent.ACTION_DOWN && e.getRepeatCount() == 0) {
                handler.removeCallbacks(quit);
                handler.postDelayed(quit, 3000);
            } else if (e.getAction() == KeyEvent.ACTION_UP) {
                handler.removeCallbacks(quit);
                if (quitting) return true;   // ya se está cerrando: no se procesa como «atrás» normal
            }
            if (quitting) return true;
        }
        return super.dispatchKeyEvent(e);
    }
}
