# common-testtools
Node-paket med gemensamma testfunktioner för projekt under SKL Intyg


## Publicera ny version

1. Öka versionsnummer i package-json
2. Lägg till autentiseringsuppgifter i .npmrc
	-  email= din epost
	- _auth= En base64-kodad sträng av "användare:lösenord". 
	
    Se https://books.sonatype.com/nexus-book/reference/npm-deploying-packages.html

	auth-token läggs förslagsvis i din globala .npmrc så att inte den av misstag commitas.
    
    
3.  `npm-publish`