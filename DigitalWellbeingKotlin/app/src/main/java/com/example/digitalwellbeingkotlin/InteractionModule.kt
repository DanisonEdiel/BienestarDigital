package com.example.digitalwellbeingkotlin

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// NOTE: This class requires React Native dependencies to compile.
// Ensure com.facebook.react:react-native is available in your build.gradle.
class InteractionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InteractionModule"
    }

    @ReactMethod
    fun getDailyMetrics(promise: Promise) {
        try {
            val date = getCurrentDate()
            val prefs = reactApplicationContext.getSharedPreferences("DailyMetrics", Context.MODE_PRIVATE)
            
            val taps = prefs.getInt("taps_$date", 0)
            val scrolls = prefs.getInt("scrolls_$date", 0)
            
            val map = WritableNativeMap()
            map.putString("recordDate", date)
            map.putInt("tapsCount", taps)
            map.putInt("scrollEvents", scrolls)
            // Avg scroll speed not currently tracked by AccessibilityService simple implementation
            map.putDouble("avgScrollSpeed", 0.0) 

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERROR_FETCHING_METRICS", e)
        }
    }

    @ReactMethod
    fun resetDailyMetrics(promise: Promise) {
         // Optional: Logic to reset metrics if needed, though accumulating is usually safer for idempotency
         promise.resolve(true)
    }

    private fun getCurrentDate(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(Date())
    }
}
