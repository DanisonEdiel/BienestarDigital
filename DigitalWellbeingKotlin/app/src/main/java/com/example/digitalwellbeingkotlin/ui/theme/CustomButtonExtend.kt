package com.example.digitalwellbeingkotlin.ui.theme

import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.runtime.Composable

@Composable
fun CustomButtonExtend(onClick: () -> Unit,content: @Composable () -> Unit) {
    ExtendedFloatingActionButton(onClick = {onClick()}) {
        content()
    }
}