package com.example.digitalwellbeingkotlin

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.SharedPreferences
import android.view.accessibility.AccessibilityEvent
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class InteractionAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event?.let {
            val date = getCurrentDate()
            val prefs = getSharedPreferences("DailyMetrics", Context.MODE_PRIVATE)
            val editor = prefs.edit()

            when (it.eventType) {
                AccessibilityEvent.TYPE_VIEW_CLICKED -> {
                    val currentTaps = prefs.getInt("taps_$date", 0)
                    editor.putInt("taps_$date", currentTaps + 1)
                }
                AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                    val currentScrolls = prefs.getInt("scrolls_$date", 0)
                    editor.putInt("scrolls_$date", currentScrolls + 1)
                    
                    // Optional: Estimate speed or other metrics here if needed
                }
            }
            editor.apply()
        }
    }

    override fun onInterrupt() {
        // Service interrupted
    }

    private fun getCurrentDate(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(Date())
    }
}
