<aside class="main-sidebar">

    <section class="sidebar">

        <!-- search form -->
        <form action="#" method="get" class="sidebar-form">
            <div class="input-group">
                <input type="text" name="q" class="form-control" placeholder="Search..."/>
              <span class="input-group-btn">
                <button type='submit' name='search' id='search-btn' class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
        </form>
        <!-- /.search form -->

        <?= dmstr\widgets\Menu::widget(
            [
                'options' => ['class' => 'sidebar-menu'],
                'items' => [
                    [
                        'label' => 'Dictionary',
                        'items' => [
                            [
                                'label' => 'Docs',
                                'items' => [
                                    ['label' => 'Dictionary', 'url' => ['docs/index', 'entity'=>'dictionary']],
                                ],
                            ],
                            [
                                'label' => 'Tests',
                                'items' => [
                                    ['label' => 'Dictionary', 'url' => ['tests/index', 'entity'=>'dictionary']],
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        ) ?>

    </section>

</aside>
