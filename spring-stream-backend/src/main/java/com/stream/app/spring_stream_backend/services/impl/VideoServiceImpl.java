package com.stream.app.spring_stream_backend.services.impl;

import com.stream.app.spring_stream_backend.entities.Video;
import com.stream.app.spring_stream_backend.repositories.VideoRepository;
import com.stream.app.spring_stream_backend.services.VideoService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLOutput;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Value("${files.video}")
    String DIR;

    @PostConstruct
    public void init(){
        File file = new File(DIR);

        if(!file.exists()){
            file.mkdir();
            System.out.println("Folder created");
        }
        else{
            System.out.println("Folder already created");
        }
    }

    @Override
    public Video save(Video video, MultipartFile file) {
        try {
        //getting original file name
        String filename = file.getOriginalFilename();
        String contentType = file.getContentType();
        InputStream inputStream = file.getInputStream();


            //file name
            String cleanFileName = StringUtils.cleanPath(filename);

            //folder path : create
            String cleanFolder = StringUtils.cleanPath(DIR);

            //folder path with file name
            Path path = Paths.get(cleanFolder, cleanFileName);
            System.out.println(path);



            //copy file to folder
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

            //video metadata
            video.setContentType(contentType);
            video.setFilePath(path.toString());

            //save metadata
            return videoRepository.save(video);


        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    @Override
    public Video get(String videoId) {
        return videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("No video found."));
    }

    @Override
    public Video getByTitle(String title) {
        return null;
    }

    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }
}
