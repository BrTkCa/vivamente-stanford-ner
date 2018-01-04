module.exports = 
[
    
        {
            $match: {
                'posts.created_time': {
                    $gte: new Date("2010-01-01T00:00:00.000Z")
                }
            }
        },
    
        {
            $unwind: '$posts'
        },
    
        {
            $match: {
                'posts.created_time': {
                    $gte: new Date("2010-01-01T00:00:00.000Z")
                }
            }
        },
    
        {
            $group: {
    
                _id: {
                    year: {
                        $year: '$posts.created_time'
                    },
                    month: {
                        $month: '$posts.created_time'
                    },
                    day: {
                        $dayOfMonth: '$posts.created_time'
                    },
                    hour: {
                        $hour: '$posts.created_time'
                    },
                    minutes: {
                        $minute: "$posts.created_time"
                    },
                    seconds: {
                        $second: "$posts.created_time"
                    },
                    dayOfYear: {
                        $dayOfYear: "$posts.created_time"
                    },
                    dayOfWeek: {
                        $dayOfWeek: "$posts.created_time"
                    },
                    data_completa: "$posts.created_time",
                    _id: '$_id'
                },
                
                est: {
                    $push: {
                        $split: ["$posts.story", ":"]
                    }
                },
                total: {
                    $sum: 1
                }
    
            },
        },
    
        {
            $sort: {
                data_completa: 1
            }
        }
    
    ];
