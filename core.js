async function awaits(docs){
    let index = 0;
    for (let item of docs){
        if (item.est) {
            if (item.est[0]) {
                item.est = item.est.join('');
                sleep.sleep(1);
                //let val = await ner.getEntities(item.est);
                let val = null;
                if (val) {
                    val.forEach((entidade) => {
                        entidade.forEach((value, key) => {
                            if (key == 'PERSON') {
                                value.forEach((nome) => {
                                    item.est = item.est.replace(nome, 'Person');
                                })
                            }
                        });
                    })
                }
            }
        }
        console.log(index, item.est);
        index++;
    }
}