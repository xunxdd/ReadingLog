angular.module('app.GlobalConfig', [])
    .service('appGlobalConfigService', function () {
        return {
            genres: [
                { name: 'Non Fiction', value: 'NF',img:'genre/nonfiction.png' },
                { name: 'Realistic Fiction', value: 'RF', img: 'genre/realistic.png' },
                { name: 'Historical Fiction', value: 'HF', img: 'genre/historical.png' },
                { name: 'Fiction', value: 'FT',img:'genre/fiction.png' },
                { name: 'Science Fiction/Fantasy', value: 'SF', img: 'genre/fantasy.png' },
                { name: 'Poetry', value: 'P', img: 'genre/poetry.png' },
                { name: 'Mystery', value: 'M', img:'genre/mystery.png' },
                { name: 'Comics', value: 'C', img: 'genre/comics.png' },
                { name: 'Magzines', value: 'MG', img: 'genre/magzine.png' }
            ],
            readWays: [
                { name: 'I read by myself', value: 1, icon:'ion-android-contact' },
                { name: 'I read with help', value: 2, icon: 'ion-android-contacts' },
                { name: 'I actively listened', value: 3, icon: 'ion-headphone' }
            ],
            grades: [
                {name:  'Pre K', value:'prek'},
                { name: 'Kindergarten', value: 'k' },
                { name: '1st Grade', value: '1' },
                { name: '2nd Grade', value: '2' },
                { name: '3rd Grade', value: '3' },
                { name: '4th Grade', value: '4' },
                { name: '5th Grade', value: '5' },
                { name: '6th Grade', value: '6' },
                { name: 'Would rather not tell', value: 'other' }
            ],
            schools: [
                {
                    name: 'Hawthorne Scholastic Academy', value: 'Hawthorne', teachers: [
                        { name: 'Mr. Blake', value: 'blake' },
                        { name: 'Ms. Bice', value: 'bice' },
                        { name: 'Ms. Thomas', value: 'thomas' }
                    ]
                },
                { name: 'Skinner West Elementary School', value: 'Skinner', teachers: []
                }
            ],
            constants: {
                GoogleApiSearchType: {
                    'isbn': 'isbn',
                    'title': 'title'
                },
                ModalTypes: {
                    'timer': 'timer',
                    'stopwatch':'stopwatch',
                    'timeform': 'timeform',
                    'scan': 'scan',
                    'search': 'search',
                    'bookform': 'bookform'
                }
            }
        };
    });

