// # What is Aggregation ? menas akotro kora
//   Aggregation is a way of processing a large number of documents in a collection by means of passing them through different stages.
//   The stages make up what is known as a pipeline. The stages in a pipeline can filter, sort, group, reshape and modify documents
//   that pass through the pipeline.

// syntax of aggregate.
db.data.aggregate([
    // stage 1
    { $match: { gender: "Male", age: { $lt: 30 } } }, // here $match is work like find and here is sign ( , ) work is explicitly and.
    // stage 2
    { $project: { name: 1, age: 1, gender: 1 } }, // here is $project is work to get data and show jeigula dorkar. sobgula data na niya.
  ]);
  
  // $addFields : notun akta field create korte pari protekta document ar moddhe and add kore dei sudu matro pipeline ar modde.
  //              orginal document ar modde modify kore na.
  
  db.data.aggregate([
    // stage 1
    { $match: { gender: "Male", age: { $lt: 30 } } },
    // stage 2
    { $addFields: { course: "devOps 2024" } },
  
    // stage 3
    { $project: { name: 1, age: 1, gender: 1, course: 1 } },
  ]);
  
  // # $out : atar madomme notun akta collection create kore tar vitor rakhte pari.
  db.data.aggregate([
    // stage 1
    { $match: { gender: "Male", age: { $lt: 30 } } },
  
    // stage 2
    { $addFields: { course: "devOps 2024", eduTech: "PHero" } },
  
    // stage 3
    { $project: { name: 1, age: 1, gender: 1, course: 1 } },
  
    // state 4
    { $out: "course-students" },
  ]);
  
  // # $marge : atair madome original document ar update korte pari that means create kora new field gula add kore dite pari
  db.data.aggregate([
    // stage 1
    { $match: { gender: "Male", age: { $lt: 30 } } },
    // stage 2
    { $addFields: { course: "devOps 2024", eduTech: "PHero" } },
  
    // stage 3
    { $project: { name: 1, age: 1, gender: 1, course: 1 } },
  
    // state 4
    { $merge: "data" }, // here is data this is collection name.
  ]);
  
  // # $group : group kore felbe akjaigai niya asbe jeigula unique na, borong common. grouping korar madome amra kisu powerful kaj
  //            korte parbo like: ( $sum, $avg, $max, $min, $count)
  //            In summary, grouping is a fundamental operation in data manipulation and analysis. It helps in summarizing, aggregating,
  //            and understanding your data, which is crucial for making informed decisions and gaining insights from your dataset.
  
  db.data.aggregate([
    // stage-1
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);
  
  // # $push : push korte parbo Name namok notun field ar vitore
  db.data.aggregate([
    // stage-1
    { $group: { _id: "$gender", count: { $sum: 1 }, Names: { $push: "$name" } } },
  ]);
  
  // another example $$ROOT
  db.data.aggregate([
    // stage-1
    {
      $group: { _id: "$gender", count: { $sum: 1 }, AllDoc: { $push: "$$ROOT" } },
    },
    // stage-2
    {
      $project: {
        "AllDoc.name": 1,
        "AllDoc.email": 1,
      },
    },
  ]);
  
  // # $sum, $avg, $max, $min, $substract, ber korte pari all document specific field.
  db.data.aggregate([
    // stage-1
    {
      $group: {
        _id: null,
        totalSalary: { $sum: "$salary" },
        maxSalary: { $max: "$salary" },
        minSalary: { $min: "$salary" },
        avagSalary: { $avg: "$salary" },
      },
    },
    // stage-1
    {
      $project: {
        maxSalary: 1,
        minSalary: 1,
        avgerageSalary: "$avagSalary",
        totalSalary: 1,
        rangeBetweenMaxandMin: { $subtract: ["$maxSalary", "$minSalary"] },
      },
    },
  ]);
  
  // # $unwind --> $unwind chalano hoi array ar upore, array ar upore direct grouping kora jaina, unwind array ar value gulake
  //              akta akta kore object banai fele, kintu protita object ar  _id same thake.
  
  db.data.aggregate([
    // stage-1
    {
      $unwind: "$friends",
    },
    // stage-2
    {
      $group: { _id: "$friends", count: { $sum: 1 } },
    },
  ]);
  
  // # $bucket --> aita akta special grouping, boundaries wise document gulare alada krote parbo, and seigulare dekhaite parbo
  db.data.aggregate([
    // stage-1
    {
      $bucket: {
        groupBy: "$age",
        boundaries: [20, 40, 60, 80],
        default: "80 ar uporer age gula man rakhbo",
        output: {
          count: { $sum: 1 },
          // karakaraase : { $push: "$name" }
          karakaraase: { $push: "$$ROOT" },
        },
      },
    },
  ]);
  
  // # $facet : atair madome amra multiple pipeline create korte pari akta same data ar modde.
  db.data.aggregate([
    {
      $facet: {
        // pipeline-1
        friendsCount: [
          // stage-1
          { $unwind: "$friends" },
          // stage-2
          { $group: { _id: "friends", count: { $sum: 1 } } },
        ],
        // pipeline-2
        EducationCount: [
          // stage-1
          { $unwind: "$education" },
          // stage-2
          { $group: { _id: "education", count: { $sum: 1 } } },
        ],
        // pipeline-3
        skillsCount: [
          // stage-1
          { $unwind: "$skills" },
          // stage-2
          { $group: { _id: "skills", count: { $sum: 1 } } },
        ],
      },
    },
  ]);
  
  // Embedding Vs Referencing : embed means bosano / isthapito kora that means amrder infomation ar sathe kisu oder info  emded hoiya jei.
  //                            on the other hand amra referencing ar modde new akta collection banaie pari and sei emabed data gula
  //                            store kore rakhte pari tar user ar id unosare
  //                            * akta document ar vitore arekta doucment dukai dite pare. like amar akta blog post ase sekhane person
  //                              comment korben and sei document ar vitore akta akata kore commnet ar document create hobe.
  
  // kokhon emdedding ar referencing korbo:
  // ** emdedding
  // 1. small data thakle and frequnently change na korle.
  // 2.
  // ** referencing
  // 1. Use referencing when the related data is large or subject to frequent updates
  
  // # indexing : is a data structure that database theke data ke retrive kore niya ase onk speed a. kom somoine ar faster kaj kore.
  // ** collscan --> page by page line by line dore sei data ber kore hoi jaite ami chai. --> 10ms
  // ** ixscan ----> direct index dore sei page chole gete pari. ar jonno time lage --> 1ms
  
  // # how to check collscan and ixscan ?
  db.data
    .find({ _id: ObjectId("6406ad63fc13ae5a40000066") })
    .explain("executionStats"); // it is fast karon id dore find kore. karon id kore IDHACk mongobd track kore rakhe. and its  in ixscan.
  
  db.data.find({ email: "amccurry3@cnet.com" }).explain("executionStats"); // not fast karon id dore find korle fast hoi na. it collscan.
  // and we can also check IDHACK in mongodb compass
  
  // now question how to do indexing: note that it is million millon data khetre recommanded.
  db.getCollection("massive-data").createIndex({ email: 1 });
  
  // now how to delete index ?
  db.getCollection("massive-data").dropIndex({ email: 1 });
  
  // now we are learn compound index : we have remember > jokhon more than field index korbo tar shthe seta accending korboe na
  // decensing korbo sera cinta korte hobe alphabetcally. > ai compound indexing korte hobe mongodb compass othaba nosql booster
  db.users.createIndex({ username: 1, country: 1 });
  
  // now we are learning search index / text index :
  // create text index
  db.getCollection("massive-data").createIndex({ about: "text" });
  
  // find search index text.
  db.getCollection("massive-data")
    .find({ $text: { $search: "dolor" } })
    .project({ about: 1 });