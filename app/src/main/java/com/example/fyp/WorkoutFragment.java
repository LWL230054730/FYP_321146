package com.example.fyp;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class WorkoutFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_workout, container, false);

        // Bind yoga image click event
        ImageView yogaImage = view.findViewById(R.id.imageView3);
        yogaImage.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), YogaVideoActivity.class);
            startActivity(intent);
        });
        ImageView hiitImage = view.findViewById(R.id.imageView1);
        hiitImage.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), HIITVideoActivity.class);
            startActivity(intent);
        });
        ImageView strengthImage = view.findViewById(R.id.imageView2);
        strengthImage.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), StrengthVideoActivity.class);
            startActivity(intent);
        });

        return view;
    }
}
