<script>

    //Création des superes globales
    let modeSolo = false
    let mondeOnline = false

    <?php if ($mode === 'solo') { ?>
        modeSolo = true
    <?php } elseif ($mode === 'duo') { ?>
        modeSolo = false
    <?php } elseif ($mode === 'online') { ?>
        modeOnline = true
    <?php } else { ?>
        modeSolo = true // De nouveau, solo en cas de problème
    <?php } ?>

</script>