package com.example.fyp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class YogaVideoActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_yoga_video);

        RecyclerView rvVideos = findViewById(R.id.rvVideos);
        rvVideos.setLayoutManager(new LinearLayoutManager(this));

        // Set video data using YouTube video ID
        List<Video> yogaVideos = new ArrayList<>();
        yogaVideos.add(new Video("Full Body Yoga", "20 min", "ANXIETY", "sTANio_2E0Q",R.drawable.yoga_video_1));
        yogaVideos.add(new Video("Gentle Yoga", "15 min", "Flexibility", "EvMTrP8eRvM",R.drawable.yoga_video_2));
        yogaVideos.add(new Video("Morning Yoga", "30 min", "Relaxation", "hHhxKkskHDg",R.drawable.yoga_video_3));
        yogaVideos.add(new Video("Yoga for Flexibility", "30 min", "Flexibility", "lQ7xA9dzwcA",R.drawable.yoga_video_4));
        yogaVideos.add(new Video("Morning Yoga Flow", "30 min", "Strength, Flexibility", "6iJCI6ZaaiE",R.drawable.yoga_video_5));

        VideoAdapter adapter = new VideoAdapter(yogaVideos, new VideoAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Video video) {
                Intent intent = new Intent(YogaVideoActivity.this, YouTubePlayerActivity.class);
                intent.putExtra("VIDEO_ID", video.getUrl()); // 傳遞 YouTube 影片 ID
                startActivity(intent);
            }
        });

        rvVideos.setAdapter(adapter);

        findViewById(R.id.ivBack).setOnClickListener(v -> finish());
    }
}
