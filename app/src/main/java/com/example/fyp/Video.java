package com.example.fyp;

public class Video {
    private String title;
    private String duration;
    private String difficulty;
    private String url;
    private int thumbnailResId;
    public Video(String title, String duration, String difficulty, String url, int thumbnailResId) {
        this.title = title;
        this.duration = duration;
        this.difficulty = difficulty;
        this.url = url;
        this.thumbnailResId = thumbnailResId;
    }

    public String getTitle() { return title; }
    public String getDuration() { return duration; }
    public String getDifficulty() { return difficulty; }
    public String getUrl() { return url; }
    public int getThumbnailResId() { return thumbnailResId; }
}
