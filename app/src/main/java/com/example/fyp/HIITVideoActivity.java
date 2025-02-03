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

public class HIITVideoActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hiit_video);

        RecyclerView rvVideos = findViewById(R.id.rvVideos);
        rvVideos.setLayoutManager(new LinearLayoutManager(this));

        // Set video data using YouTube video ID
        List<Video> hiitVideos = new ArrayList<>();
        hiitVideos.add(new Video("Calorie Killer HIIT Workout", "20 min", "High level","adDGcsdu8WY",R.drawable.hiit_video_1));
        hiitVideos.add(new Video("Intense HIIT Workout For Fat Burn ", "15 min", "High level","J212vz33gU4",R.drawable.hiit_video_2));
        hiitVideos.add(new Video("Gentle Beginners HIIT Workout", "15 min", "Easy level","O6olj0O3h4w",R.drawable.hiit_video_3));
        hiitVideos.add(new Video("Standing No Jumping HIIT workout", "30 min", "Easy level","56A-3qmJFjs",R.drawable.hiit_video_4));
        hiitVideos.add(new Video("Intense HIIT Workout", "30 min", "High level","4nPKyvKmFi0",R.drawable.hiit_video_5));

        VideoAdapter adapter = new VideoAdapter(hiitVideos, new VideoAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Video video) {
                Intent intent = new Intent(HIITVideoActivity.this, YouTubePlayerActivity.class);
                intent.putExtra("VIDEO_ID", video.getUrl());
                startActivity(intent);
            }
        });

        rvVideos.setAdapter(adapter);

        findViewById(R.id.ivBack).setOnClickListener(v -> finish());
    }
}