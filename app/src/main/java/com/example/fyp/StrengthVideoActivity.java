package com.example.fyp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class StrengthVideoActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_strength_video);

        RecyclerView rvVideos = findViewById(R.id.rvVideos);
        rvVideos.setLayoutManager(new LinearLayoutManager(this));

        // Set video data using YouTube video ID
        List<Video> strengthVideos = new ArrayList<>();
        strengthVideos.add(new Video("Dumbbell Chest Workout", "15 min", "Chest Training ", "4o1YzksPuqg",R.drawable.strength_video_1));
        strengthVideos.add(new Video("Back Workout", "15 min", "Back Training", "jyWEHAkgI2g",R.drawable.strength_video_2));
        strengthVideos.add(new Video(" Dumbbell Strength Workout", "20 min", "Upper Body", "Z3tC4zLo4BQ",R.drawable.strength_video_3));


        VideoAdapter adapter = new VideoAdapter(strengthVideos, new VideoAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Video video) {
                Intent intent = new Intent(StrengthVideoActivity.this, YouTubePlayerActivity.class);
                intent.putExtra("VIDEO_ID", video.getUrl());
                startActivity(intent);
            }
        });

        rvVideos.setAdapter(adapter);

        findViewById(R.id.ivBack).setOnClickListener(v -> finish());
    }
}